package com.platform.project.olo.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Service;

import com.platform.db.Page;
import com.platform.project.olo.model.Postil;
import com.platform.project.olo.model.Subject;
import com.platform.project.olo.service.ISubjectService;
import com.platform.project.sys.model.Role;
import com.platform.project.sys.model.User;
import com.platform.project.sys.model.UserRole;
import com.platform.project.sys.service.BaseService;
import com.platform.util.EmptyUtils;
import com.platform.util.ExtractFile;

@Service
public class SubjectServiceImpl extends BaseService implements ISubjectService {

	@Override
	public List<?> findSubjectData() throws ServiceException {
		return hibernateDao.queryByHql("from "+Subject.class.getName()+" where visible=1 order by sortId");
	}

	@Override
	public List<?> findCatalogData(String subNo) throws ServiceException {
		
		String sql="select ID,NAME,PID from tb_subject where ID=? and visible=1 union select ID,NAME,PID from tb_catalog1 where pid=? and visible=1";
		return hibernateDao.queryList(sql,new Object[]{subNo,subNo});
	}

	@Override
	public List<?> findSliceData(String cataNo,String sql1) throws ServiceException {
		String sql="select ID,NAME,PID from tb_slice where pid=? and visible=1"+sql1;
		return hibernateDao.queryList(sql,new Object[]{cataNo});
	}

	@Override
	public List<?> findSliceNames() throws ServiceException {
		String filePath= "D:\\slice\\example";//SpringUtil.getProperty("example_file_path");
		File[] files = new File(filePath).listFiles();
		List<String> list=new ArrayList<>();
		for (int i = 0; i < files.length; i++) {
			 list.add(files[i].getName());
		}
		return list;
	}

	@Override
	public Object findSliceInfo(String sliceNo) throws ServiceException {
		/*String sql="select t.id ID,t.name NAME,t.path PATH,t.pid PID,t.visible VISIBLE,t.sortid SORTID,c.name CNAME,s.name SNAME from tb_slice t,tb_catalog1 c,tb_subject s where t.pid=c.id and c.pid=s.id and t.id=?";
		Map<String, Object> map=hibernateDao.queryMap(sql, new Object[]{sliceNo});
		
		if(!EmptyUtils.isNotEmpty(map)){
			return null;
		}*/
		String path="";
		Map<String, Object> map=new HashMap<String, Object>();
		/*if(EmptyUtils.isNotEmpty(map.get("SNAME")) && EmptyUtils.isNotEmpty(map.get("CNAME")) && EmptyUtils.isNotEmpty(map.get("NAME"))){
			path+=map.get("SNAME").toString()+"/"+map.get("CNAME").toString()+"/"+map.get("NAME").toString()+"/"+map.get("NAME").toString();
		}else{
			return null;
		}*/
		path+="2/1023/1035/1050/1053/1053";
		Object obj=ExtractFile.getSliceTileData(path,sliceNo);
		if(EmptyUtils.isNotEmpty(obj)){
			ExtractFile extractFile=(ExtractFile)obj;
			map.put("WIDTH", extractFile.ImageWidth);
			map.put("HEIGHT", extractFile.ImageHeight);
			map.put("MAXLEVEL", extractFile.maxLevel);
			map.put("NAME", "乙型脑炎");
			map.put("ID", sliceNo);
		}
		return map;
	}
	@Override
	public byte[] tileUrlSlice(String level, String x, String y,
			String sliceNo) throws ServiceException, InterruptedException {
		return ExtractFile.getSliceTileData(level,x,y,sliceNo);
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean savePostil(String postil,String sliceNo,String userName,String noteBL) throws ServiceException {
		
        List<Object> list= hibernateDao.queryByHql("from "+User.class.getName()+" where encode='"+userName+"'");
		
		if(EmptyUtils.isNotEmpty(list)){
		     
			User user=(User)list.get(0);
			
			Integer note=0;
			
			if(noteBL.equals("true")){
				
				 note=1;
			}
			jdbcTemplate.execute("insert into tb_postil values(null,'"+postil+"',"+sliceNo+","+user.getId()+")");
			//jdbcTemplate.execute("update tb_postil set b='"+postil+"' where sliceNo="+sliceNo);

		}
		
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Object loadPostil(String sliceNo,String userName) throws ServiceException {
		
        List<Object> list= hibernateDao.queryByHql("from "+User.class.getName()+" where encode='"+userName+"'");
		
        List<Object> l=null;
        
		if(EmptyUtils.isNotEmpty(list)){
		     
			User user=(User)list.get(0);
			
			l= hibernateDao.queryByHql("from "+Postil.class.getName()+" where sliceNo="+sliceNo+" and userId="+user.getId());

		}
		
		return l;
	}

	@Override
	public void uploadFile(File file) throws ServiceException {
		// TODO 自动生成的方法存根
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public Integer loginUser(String userName) throws ServiceException {
		
		List<Object> list= hibernateDao.queryByHql("from "+User.class.getName()+" where encode='"+userName+"'");
		
		if(EmptyUtils.isNotEmpty(list)){
		     
			User user=(User)list.get(0);
			
			List<Object> l= hibernateDao.queryByHql("select r.id from "+UserRole.class.getName()+" u,"+Role.class.getName()+" r where u.roleId=r.id and u.userId="+user.getId());
			
			return Integer.parseInt(l.get(0).toString());

		}
		return 0;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Map findSubjectPageData(String subNo,String pageNo) throws ServiceException {
		
		String nodeSql="select ID,NAME,PID,SLICEFLAG from tb_catalog1 where pid in (select id from tb_catalog1 where pid=? and visible=1 order by chapsort) and visible=1 order by chapsort,nodesort";
		
		String sql="select ID,NAME,PID,SLICEFLAG from tb_catalog1 where id=? and visible=1";
		
		List<?> nodeList= hibernateDao.queryList(nodeSql, new Object[]{subNo});
		
		int index=Integer.parseInt(pageNo);
		
		Object obj= nodeList.get(index-1);
		
		Map map= null;
		
		Map m=null;
		
		if(EmptyUtils.isNotNull(obj)){
			
			m=(Map)obj;
			
			map= hibernateDao.queryMap(sql,new Object[]{m.get("PID")});
			
			m.put("CHILD",findChildNode(m)) ;
		}
		
		if(EmptyUtils.isNotNull(map)){
			
			
			map.put("CHILD",new Object[]{m}) ;
		}
				
		return map;
	}
	
	@SuppressWarnings("unchecked")
	public List findChildNode(Map m){
		
		String sql="select ID,NAME,PID,SLICEFLAG from tb_catalog1 where pid=? and visible=1 order by sortid";
		
		List<?> list=hibernateDao.queryList(sql,new Object[]{m.get("ID")});
		
		if(EmptyUtils.isNotEmpty(list)){
			
            for (Object object : list) {
				
				Map map=(Map)object;
				
				findChildNode(map);
				
			}
		}	
			
	    m.put("CHILD", list);
		return list;
	}

	@Override
	public Map findSubjectPageTotal(String subNo) throws ServiceException {
		
        String sql="select count(*) as TOTAL from tb_catalog1 where pid in (select id from tb_catalog1 where pid=? and visible=1 order by chapsort) and visible=1 order by chapsort,nodesort";
		
		Map map= hibernateDao.queryMap(sql,new Object[]{subNo});
		
		return map;
	}
	
	

}
